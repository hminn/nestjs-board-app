import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../boards.model';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
  transform(value: any) {
    const upperValue = value.toUpperCase();
    if (!this.isStatusValid(upperValue)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }
    return upperValue;
  }
}
