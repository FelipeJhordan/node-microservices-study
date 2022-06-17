import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { Producer } from 'kafkajs'; // Obrigado túlio, REPRESENTANDO O BRASIL
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private kafkaProducer: Producer,
  ) {}
  //DTO - Data transfer object
  @Post()
  create(
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @MessagePattern('topico-exemplo')
  consume(@Payload() message: KafkaMessage) {
    console.log(message.value);
  }

  @Post('producer')
  producer(@Body() body) {
    this.kafkaProducer.send({
      topic: 'topico-exemplo',
      messages: [
        {
          key: 'pagamentos',
          value: JSON.stringify(body),
        },
      ],
    });

    return {
      message: 'mensagem publicada',
    };
  }
}

//DELETE 400 e 500 - Sucesso

// {success: false}
