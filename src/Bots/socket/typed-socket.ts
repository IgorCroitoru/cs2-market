import { Last } from "socket.io/dist/typed-events";
import { ResponseCallbackData, ResponseCallbackInventory, SocketEvents } from "../bot-info-payload";
import { Socket } from 'socket.io';

    
    
export class TypedSocket {
    public socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    on<K extends keyof SocketEvents>(event: K, listener: (...args: SocketEvents[K]) => void): void {
        this.socket.on(event, listener as any);
    }

    emit<K extends keyof SocketEvents>(event: K, ...args: SocketEvents[K]): void {
        this.socket.emit(event, ...args);
    }
    
    emitWithTimeout<K extends keyof SocketEvents>(timeout: number, event: K, ...args: SocketEvents[K]): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Timeout'));
            }, timeout);

            this.socket.emit(event, ...args, (response: ResponseCallbackData) => {
                clearTimeout(timeoutId);
                
                return resolve(response);
               
            });
        });
    }
    // emitWithAck<K extends keyof SocketEvents>(event:K, ...args:SocketEvents[K]):Promise<any>{
    //     return this.socket.emitWithAck(event,...args)
    // }

    // Optional: You can add other socket.io methods as needed
    disconnect(): void {
        this.socket.disconnect();

    }

    
}

export function createTypedSocket(socket: Socket): TypedSocket {
    return new TypedSocket(socket);
}
