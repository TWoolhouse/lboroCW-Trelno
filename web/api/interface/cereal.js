import { Memoize } from "./memoize.js";

/**
 * Constructs the Object from serialised fields if available
 * @param {Object} self
 * @param {Object} object
 * @returns {Boolean} True if loaded from serialisation
 */
export function cereal(self, object) {
  if (object.cereal) {
    delete object.cereal;
    Object.assign(self, object);
    return true;
  }
  return false;
}

/**
 * Gets the Type name of an instance
 * @param {*} object
 * @returns {String} Name of the Instance's Type
 */
export function protoName(object) {
  if (object === undefined) return undefined;
  return object.__proto__.constructor.name;
}

/**
 * Registers a type to have a custom serialisation method
 * @param {Type} type The Type to register to cereal
 */
export function register(type) {
  REGISTERED_TYPES[type.name] = type;
}

const REGISTERED_TYPES = {};

function cerealise(object, cereal) {
  if (REGISTERED_TYPES[protoName(object)] && object.id)
    return cerealise_object(object, "", cereal);
  return cerealise_layer(object, "", cereal);
}

function cerealise_layer(object, key, cereal) {
  if (REGISTERED_TYPES[protoName(object)]) {
    if (object.id !== undefined) return cerealise_db(object, key, cereal);
    return cerealise_registered(object, key, cereal);
  } else if (object instanceof Object)
    return cerealise_object(object, key, cereal);
  return object;
}

function cerealise_db(object, key, cereal) {
  cereal.fields[key.substring(1)] = { type: protoName(object), db: 1 };
  return object.id;
}

function cerealise_registered(object, key, cereal) {
  const typename = protoName(object);
  const type = REGISTERED_TYPES[typename];
  cereal.fields[key.substring(1)] = { type: protoName(object) };
  return type.cereal.serialise(object);
}
function cerealise_object(object, okey, cereal) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([key, _]) => !cereal.ignore.includes(key))
      .map(([key, value]) => [
        key,
        cerealise_layer(value, `${okey}.${key}`, cereal),
      ])
  );
}

/**
 * Converts object to a cereal form.
 * @param {Object} object Object to serialise
 * @returns {Object}
 */
export function serialise(object) {
  let cereal = {
    cereal: {
      type: protoName(object),
      fields: {},
      ignore:
        (object.cereal ?? object.__proto__.constructor.cereal ?? {}).ignore ??
        [],
    },
  };
  Object.assign(cereal, cerealise(object, cereal.cereal));
  delete cereal.cereal.ignore;
  return cereal;
}

/**
 * Converts a cereal object back into its original Type.
 * @param {Object} object
 * @returns {*}
 */
export async function deserialise(object) {
  // TODO: Child fields. Use dot split char
  for (const [name, field] of Object.entries(object.cereal.fields)) {
    object[name] = await decereal_field(field, object[name]);
  }
  let type = REGISTERED_TYPES[object.cereal.type] ?? Object;
  return Reflect.construct(type, [object]);
}

async function decereal_field(field, object) {
  const type = REGISTERED_TYPES[field.type];
  if (field.db) {
    return await Memoize.Name(field.type).get(object);
  }
  return await type.cereal.deserialise(object);
}
