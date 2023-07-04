export class Ministry {

    constructor(
        public _id?: string,
        public name: string = '',
        public priority: number = 10,
        public description: string = '',
    ) { }

    setId?(id: string = 'r101') {
        // Implement your own set Id
        this._id = id
    }
}

