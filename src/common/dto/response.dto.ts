export class ResponseDto<T> {
  status: boolean;
  message: string;
  data?: T;
  meta?: any;
  timestamp: string;

  constructor(partial: Partial<ResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Thành công', meta?: any): ResponseDto<T> {
    return new ResponseDto({
      status: true,
      message,
      data,
      meta,
    });
  }

  static error(message = 'Lỗi hệ thống', meta?: any): ResponseDto<null> {
    return new ResponseDto({
      status: false,
      message,
      meta,
    });
  }
}
