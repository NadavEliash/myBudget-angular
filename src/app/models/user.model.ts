export class User {

    constructor(
        public _id?: string,
        public name: string = '',
        public balance: number = 100,
        public spend: [{
            to: string
            toId: string
            amount: number
        }] = [{
            to: '',
            toId: '',
            amount: 0
        }]
    ) { }
}