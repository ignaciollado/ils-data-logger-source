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
  label: "Reg ID"
},
{
  key: "Ambito",
  type: "scope",
  label: "Scope"
},
{
  key: "Titulo",
  type: "textarea",
  label: "Title"
},
{
  key: "link",
  type: "url",
  label: "Linked to"
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