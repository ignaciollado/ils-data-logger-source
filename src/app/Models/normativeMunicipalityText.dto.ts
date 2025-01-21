export class NormativeMunicipalityTextDTO {
  id?: number
  regId?: string
  Municipio?: string
  Vector?: string
  Titulo?: string
  isEdit: boolean
  isSelected: boolean
}

export const normativeColumns = [
{
  key: "regId",
  type: "readOnly",
  label: "ID texto normativo"
},
{
  key: "Municipio",
  type: "municipio",
  label: "Municipio"
},
{
  key: "Vector",
  type: "vector",
  label: "Vector"
},
{
  key: "Titulo",
  type: "text",
  label: "Título"
},
{
  key: "isEdit",
  type: "isEdit",
  label: ""
},
]