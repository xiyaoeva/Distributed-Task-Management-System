
let ioRef = null;
export function initSocket(io) {
  ioRef = io;
}
export function emitTaskCreated(task){
  if(ioRef){
    ioRef.emit('tasks', { type: 'created', task });
  }
}
