import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EnvironmentCredentials } from "aws-sdk";
import { ENOENT } from "constants";
import fs = require('fs');
import * as Scry from "scryfall-sdk";

@Injectable()
export class ScryfallService {

}