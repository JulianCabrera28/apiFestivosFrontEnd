import { Tipo } from "./Tipo";
import { Pais } from "./Pais";

export interface Festivo {
    id: number;
    nombre: string;
    dia: number;
    mes: number;
    diasPascua: number;
    idTipo: number;
    idPais: number;
    tipo?: Tipo;
    pais?: Pais;
}
