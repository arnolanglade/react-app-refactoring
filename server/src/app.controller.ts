import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  text: string;
  done: boolean;
}

@Controller('tasks')
export class AppController {
  private tasks: Task[] = [];

  @Get()
  findAll(): Task[] {
    return this.tasks;
  }

  @Post()
  create(@Body() task: Task) {
    task.id = uuidv4();
    this.tasks.push(task);

    return task
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatedTask: Task) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
