import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { NotFoundException } from '@nestjs/common';
import { Flavor } from './entities/flavor.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
	constructor(
		@InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,
		@InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>
	) {}

	private coffees = ([] = [
		{
			id: 1,
			name: 'Shipwreck Roast',
			brand: 'Buddy Brew',
			flavors: [ 'chocolate', 'vanilla' ]
		}
	]);

	findAll() {
		return this.coffeeRepository.find({
			relations: [ 'flavors' ]
		});
	}

	async findOne(id: string) {
		const coffee = await this.coffeeRepository.findOne({ where: { id: +id }, relations: [ 'flavors' ] });
		if (!coffee) {
			throw new Error(`Coffee #${id} not found`);
		}
		return coffee;
	}

	async create(createCoffeeDto: CreateCoffeeDto) {
		const flavors = await Promise.all(createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)));

		const coffee = this.coffeeRepository.create({...createCoffeeDto, flavors});
		return this.coffeeRepository.save(coffee);
	}

	async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
		const flavors =
			updateCoffeeDto.flavors &&
			(await Promise.all(updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name))));

		const coffee = await this.coffeeRepository.preload({ id: +id, ...updateCoffeeDto, flavors });
		if (!coffee) {
			throw new NotFoundException(`Coffee #${id} not found`);
		}
		return this.coffeeRepository.save(coffee);
	}

	async remove(id: string) {
		const coffee = await this.findOne(id);
		return this.coffeeRepository.remove(coffee);
	}

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFlavor = await this.flavorRepository.findOne({ where: { name: name } });
		if (existingFlavor) return existingFlavor;
		return this.flavorRepository.create({ name });
	}
}
