import { HttpRequest } from "@angular/common/http";

export class CustomHttpRequest<T = unknown> extends HttpRequest<T> {
  targetElId?: string;
}
