export class NormativeTextDTO {
  regId?: string
  Ambito: string
  Titulo: string
  link: string
  idNormativa?: number
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
  key: "Ambito",
  type: "scope",
  label: "Ámbito"
},
{
  key: "Titulo",
  type: "textarea",
  label: "Título"
},
{
  key: "link",
  type: "url",
  label: "Link"
},

/* {
  key: "idNormativa",
  type: "number",
  label: "Ref. normativa"
}, */
{
  key: "isEdit",
  type: "isEdit",
  label: ""
},
]