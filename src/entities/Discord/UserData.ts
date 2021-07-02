import { Document, Field } from 'ts-mongodb-orm';

@Document({ collectionName: 'userData' })
export class UserData {
    // discord ID
    @Field()
    public _id!: string;

    @Field()
    public points = 0;
}
