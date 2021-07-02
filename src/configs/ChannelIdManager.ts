import { isProduction } from '../utils';

export class ChannelIdManager<T extends Record<string, T[string]> & Record<'dev', T[string]>> {
    constructor(private _data: T) {
        //
    }

    // returning development channel ids while not in production
    public get(key: keyof T) {
        return isProduction ? this._data[key] : this._data.dev;
    }
}
