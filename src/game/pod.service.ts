import { Injectable } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { CreatePodDto } from "./dto/create-pod.dto";
import { Pod } from "./entities/pod.entity";

@Injectable()
export class PodService {
  
  async create(createPodDto: CreatePodDto) {
    const pod = Pod.create<Pod>(createPodDto);
    return pod.save();
  }

  findOne(id: number) {
    return Pod.findOneBy({ id: id });
  }

  getPodByUserId(userId: number) {
    return Pod.createQueryBuilder('pod')
      .leftJoinAndSelect('pod.players', 'player')
      .leftJoin('player.user', 'user')
      .where("user.id = :id", { id: userId })
      .getMany();
  }
}