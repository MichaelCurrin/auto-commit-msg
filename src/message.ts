export function one(action: string, path: string): string {
  let msgAction;
  switch (action) {
    case 'new file':
      msgAction = 'Create';
      break;
    case 'modified':
      msgAction = 'Update';
      break;
    case 'delete':
      msgAction = 'Delete';
      break;
    default:
      throw new Error(`Invalid action: ${action}`);
  }

  return `${msgAction} ${path}`;
}

export function move(oldPath: string, newPath: string): string {
  return `Rename ${oldPath} to ${newPath}`;
}
