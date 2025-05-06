import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  worker = new Worker(new URL('../worker/worker', import.meta.url));
}
