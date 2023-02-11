import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  getServerInfo(): string {
    return `${os.hostname}`;
  }
}
