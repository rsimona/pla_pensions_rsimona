import { resolve } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

type tRetencio = {
    min: number;
    max: number;
    retencio: number;
}

class Desgravacio {
    private baseImponible: number;
    private aportacio: number;

    private tramsRetencio: tRetencio[] = [
        { min: 0, max: 12250, retencio: 19 },
        { min: 12250, max: 20200, retencio: 24 },
        { min: 20200, max: 35200, retencio: 30 },
        { min: 35200, max: 60000, retencio: 37 },
        { min: 60000, max: 300000, retencio: 45 },
        { min: 300000, max: -1, retencio: 47 }
    ];

    constructor(baseImponible: number) {
        this.baseImponible = baseImponible;
        this.aportacio = 0;
    }

    setAportacio(aportacio: number) {
        this.aportacio = aportacio > 2000 ? 2000 : aportacio;
    }

    getDesgravacio() {
        //        const escala:tRetencio = this.tramsRetencio.find(
        const escala = this.tramsRetencio.find(
            e => this.baseImponible >= e.min && (this.baseImponible <= e.max ||
                e.max === -1)
        );
        if (escala !== undefined) {
            const desgravacio = (this.aportacio * escala.retencio) / 100;
            console.log(`El teu percentatge de retenció és de ${escala.retencio}%`);
            return desgravacio;
        }
        return -1;
    }
}


let tipus_pla_pensions: Number = 0;
let base_imposable: Number = 0;
let desgravacioTotal = 0;

const preguntarPlaPensions = () => {
    return new Promise<void>((resolve, reject) => {
        console.log('1.Pla de pensions persona física');
        console.log('2.Pla de pensions empresarial');
        console.log('3.Tots dos');
        rl.question('Quin pla de pensions vols realitzar? ', (answer: String) => {
            const n: number = +answer;
            tipus_pla_pensions = n;
            console.log(`has escollit: ${tipus_pla_pensions}`);
            resolve();
        });
    })
}

const preguntarBaseImposable = () => {
    return new Promise<void>((resolve, reject) => {
        rl.question('Quina és la teva Base Imposable? ', (answer: String) => {
            const n: number = +answer;
            base_imposable = n;
            console.log(`Base imposable: ${n}`);
            resolve();
        });
    })
}


const preguntarAportacioPersonaFisica = () => {
    return new Promise<void>((resolve, reject) => {
        rl.question('Quina és la teva aportació al pla de pensions de persona física? ', (answer: String) => {
            const n: number = +answer;
            //rl.close();
            const desgravacio = new Desgravacio(n);
            desgravacio.setAportacio(n);
            console.log(`La teva desgravació del pla de pensions de persona física és de ${desgravacio.getDesgravacio()}`);
            desgravacioTotal += desgravacio.getDesgravacio();
            resolve();
        });
    })
}

const preguntarAportacioEmpresarial = () => {
    return new Promise<void>((resolve, reject) => {
        rl.question('Quina és la teva aportació al pla de pensions empresarial? ', (answer: String) => {
            const n: number = +answer;
            //rl.close();
            const desgravacio = new Desgravacio(n);
            desgravacio.setAportacio(n);
            console.log(`La teva desgravació del pla de pensions empresarial és de ${desgravacio.getDesgravacio()}`);
            desgravacioTotal += desgravacio.getDesgravacio();
            resolve();
        });
    })
}

const main = async () => {
    await preguntarPlaPensions();
    await preguntarBaseImposable();

    if (tipus_pla_pensions == 1 || tipus_pla_pensions == 3) {
        await preguntarAportacioPersonaFisica();
    }

    if (tipus_pla_pensions == 2 || tipus_pla_pensions == 3) {
        await preguntarAportacioEmpresarial();
    }

    console.log(`La teva desgravació total és de ${desgravacioTotal}`);
}

main();


