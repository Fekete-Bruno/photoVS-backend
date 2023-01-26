import { faker } from "@faker-js/faker";
import repository from "../../src/repositories/todo.repository";
import { To_do_Creator } from "../../src/protocols";

export function createToDo(todo: To_do_Creator) {
    return repository.insertOne(todo);
}

export function createRandomToDo(){
    const todo: To_do_Creator = {
        text: faker.lorem.sentence(),
        is_done:faker.datatype.boolean()
    }
    
    return repository.insertOne(todo);
}

export function clearAll(){
    repository.cleanDb();
}