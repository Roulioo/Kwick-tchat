import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  /**
   * Show success toaster
   * @param message Message of toaster
   * @param title Title of toaster
   */
  showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  /**
   * Show error toaster
   * @param message Message of toaster
   * @param title Title of toaster
   */
  showError(message, title) {
    this.toastr.error(message, title);
  }
}
