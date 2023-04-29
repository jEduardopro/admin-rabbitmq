import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {

	constructor(
		private productService: ProductService,
		@Inject('PRODUCT_SERVICE') private readonly client: ClientProxy
	){}

	@Get()
	all() {
		// this.client.emit('hello', 'Hello from RabbitMQ')
		return this.productService.getProducts()
	}

	@Post()
	async create(@Body() body) {
		const product = await this.productService.create(body)
		this.client.emit('product_created', product)
		return product
	}

	@Get(':id')
	get(@Param('id') id: number) {
		return this.productService.get(id)
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() body) {
		await this.productService.update(id, body)

		const product = await this.productService.get(id);
		this.client.emit('product_updated', product);
		return product;
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		await this.productService.destroy(id)
		this.client.emit('product_deleted', id);
	}

}
