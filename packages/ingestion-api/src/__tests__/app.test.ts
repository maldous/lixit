import { AppService } from '../app.service';
import { AppController } from '../app.controller';

describe('AppService', () => {
  test('should return Hello World', () => {
    expect(new AppService().getHello()).toBe('Hello World!');
  });
});

describe('AppController', () => {
  test('should return Hello World', () => {
    const service = new AppService();
    expect(new AppController(service).getHello()).toBe('Hello World!');
  });
});
