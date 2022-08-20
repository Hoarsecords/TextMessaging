import { BooleanResponse } from './RepoError';

//We will user Observer pattern to implement ChatRoom logic.
export interface IObserver<S, O, T> {
  update(subject: S, observer: O, data: T): Promise<void>;
}

export interface ISubject<S, O> {
  registerObserver(observer: O, subject: S): Promise<BooleanResponse<O | S>>;
  removeObserver(observer: O, subject: S): Promise<BooleanResponse<O | S>>;
  notifyObservers(subject: S, message: any): Promise<void>;
}
