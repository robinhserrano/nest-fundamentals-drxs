//Shortcut
import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
	constructor(private readonly coffeesService: CoffeesService) {}

	@Get()
	findAll() {
		return this.coffeesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.coffeesService.findOne(id);
	}

	@Post()
	create(@Body() body) {
		return this.coffeesService.create(body);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body) {
		return this.coffeesService.update(id, body);
	}

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
