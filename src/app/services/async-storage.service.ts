import { Ministry } from "../models/ministry.model"

export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    makeId
}

type Entity = Ministry

async function query(entityType: string, delay = 10): Promise<Entity[]> {
    var entities = JSON.parse(localStorage.getItem(entityType) || 'null') || []
    if (delay) {
        return new Promise((resolve) => setTimeout(resolve, delay, entities))
    }
    return entities
}

async function get(entityType: string, entityId: string): Promise<Entity> {
    const entities = await query(entityType)
    const entity = entities.find(entity => entity._id === entityId)
    if (!entity) throw new Error(`Cannot get, Item ${entityId} of type: ${entityType} does not exist`)
    return entity;
}

async function post(entityType: string, newEntity: Entity): Promise<Entity> {
    const entities = await query(entityType)
    entities.unshift(newEntity)
    _save(entityType, entities)
    return newEntity
}

async function put(entityType: string, updatedEntity: Entity): Promise<Entity> {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
    entities[idx] = updatedEntity
    _save(entityType, entities)
    return updatedEntity
}

async function remove(entityType: string, entityId: string): Promise<string> {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity._id === entityId)
    if (idx !== -1) entities.splice(idx, 1)
    else throw new Error(`Cannot remove, item ${entityId} of type: ${entityType} does not exist`)
    _save(entityType, entities)
    return entityId;
}


function _save(entityType: string, entities: Entity[]) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}