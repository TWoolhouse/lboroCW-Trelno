import { Memoize } from "./memoize.js";

export function cereal(self, object) {
  if (object.cereal) {
    delete object.cereal;
    Object.assign(self, object);
    return true;
  }
  return false;
}

export function protoName(object) {
  if (object === undefined) return undefined;
  return object.__proto__.constructor.name;
}

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
    Object.entries(object).map(([key, value]) => [
      key,
      cerealise_layer(value, `${okey}.${key}`, cereal),
    ])
  );
}

export function serialise(object) {
  let cereal = {
    cereal: {
      type: protoName(object),
      fields: {},
    },
  };
  return Object.assign(cereal, cerealise(object, cereal.cereal));
}

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
