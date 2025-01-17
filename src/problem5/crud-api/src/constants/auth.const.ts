export enum Permission {
  MANAGE_USER = 'manageUser',
  READ_USER = 'readUser',
  VIEW_ORDER = 'viewOrder',
  EDIT_ORDER = 'editOrder',
  CREATE_ORDER = 'createOrder',
  DELETE_ORDER = 'deleteOrder'
}

export enum AuthType {
  JWT = 'jwt',
  OAUTH = 'oauth'
}
