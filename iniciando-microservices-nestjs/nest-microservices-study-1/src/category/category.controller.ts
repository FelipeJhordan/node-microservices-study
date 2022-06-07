import { Controller, Get } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  @Get()
  index() {
    return 'Categories';
  }
}
