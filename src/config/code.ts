export const OK: number = 200; // OK
export const INVALID_ARGUMENT: number = 400; // 无效参数
export const UNAUTHENTICATED: number = 401; // 身份验证失败
export const PERMISSION_DENIED: number = 403; // 权限不足
export const NOT_FOUND: number = 404;
export const ABORTED: number = 409; // 找不到资源或资源已经存在，并发冲突，例如读取/修改/写入冲突
export const RESOURCE_EXHAUSTED: number = 429; // 超过限额
export const CANCELLED: number = 499; // 请求被客户端取消
export const INTERNAL: number = 500; // 服务器内部错误
export const NOT_IMPLEMENTED: number = 501; // API方法未实现
export const UNAVAILABLE: number = 503; // 	服务不可用
export const DEADLINE_EXCEEDED: number = 504; // 超出请求时限

export const ERR_MSG = {
  [OK]: "OK",
  [INVALID_ARGUMENT]: "无效参数",
  [UNAUTHENTICATED]: "身份验证失败",
  [PERMISSION_DENIED]: "权限不足",
  [NOT_FOUND]: "not found",
  [ABORTED]: "找不到资源或资源已经存在",
  [RESOURCE_EXHAUSTED]: "超过限额",
  [CANCELLED]: "请求被客户端取消",
  [INTERNAL]: "服务器内部错误",
  [NOT_IMPLEMENTED]: "API方法未实现",
  [UNAVAILABLE]: "服务不可用",
  [DEADLINE_EXCEEDED]: "超出请求时限"
};
