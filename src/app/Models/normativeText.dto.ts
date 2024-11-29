export class NormativeTextDTO {
  regId?: string
  Ambito: string
  Titulo: string
  link: string
  idNormativa?: Number
  isEdit: boolean
  isSelected: boolean
}

export const normativeColumns = [
  {
    key: "regId",
    type: "text",
    label: "ID key"
},
{
    key: "Ambito",
    type: "text",
    label: "Scope"
},
{
    key: "Titulo",
    type: "text",
    label: "Title"
},
{
  key: "link",
  type: "string",
  label: "Linked to"
},
{
  key: "idNormativa",
  type: "number",
  label: "Ref. normativa"
},
]