export const commonRouter = {
    getKey: (object, options) => {
        const result = [], str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";

        for (let i = 0; i < 17; i++) {
            
            result.push(str.charAt(Math.floor(Math.random() * (str.length - 1))));
        }
        

        return {
            status: 200,
            data: result.join(''),
            message: "Random key generated successfully!"
        };
    }
}

