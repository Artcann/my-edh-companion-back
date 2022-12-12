import { Injectable } from "@nestjs/common";
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
}