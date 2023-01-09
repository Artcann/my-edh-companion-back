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

  async findAll() {
    return Pod.find()
  }

  async findOne(id: number) {
    return Pod.findOneBy({ id: id });
  }

  async getPodByUserId(userId: number) {
    const pods = await Pod.createQueryBuilder('pod')
      .leftJoin('pod.players', 'player')
      .leftJoin('player.user', 'user')
      .where("player.user.id = :id", { id: userId })
      .select("pod.id")
      .getMany();
    
    const podsId = pods.map(pod => pod.id)

    return Pod.createQueryBuilder('pod')
      .leftJoinAndSelect('pod.players', 'player')
      .where("pod.id = ANY(:podsId)", { podsId: podsId })
      .getMany()
  }
}