// Libraries
import React, {PureComponent} from 'react'

// Components
import {
  IndexList,
  Alignment,
  ComponentSize,
  ConfirmationButton,
} from 'src/clockface'

// Types
import {Variable} from '@influxdata/influx'
import EditableName from 'src/shared/components/EditableName'

interface Props {
  variable: Variable
  onDeleteVariable: (variable: Variable) => void
  onUpdateVariable: (variable: Partial<Variable>) => void
  onEditVariable: (variable: Variable) => void
}

export default class VariableRow extends PureComponent<Props> {
  public render() {
    const {variable, onDeleteVariable} = this.props

    return (
      <IndexList.Row>
        <IndexList.Cell alignment={Alignment.Left}>
          <EditableName
            onUpdate={this.handleUpdateVariableName}
            name={variable.name}
            noNameString={'NAME THIS VARIABLE'}
            onEditName={this.handleEditVariable}
          >
            {variable.name}
          </EditableName>
        </IndexList.Cell>
        <IndexList.Cell alignment={Alignment.Left}>{'Query'}</IndexList.Cell>
        <IndexList.Cell revealOnHover={true} alignment={Alignment.Right}>
          <ConfirmationButton
            size={ComponentSize.ExtraSmall}
            text="Delete"
            confirmText="Confirm"
            onConfirm={onDeleteVariable}
            returnValue={variable}
          />
        </IndexList.Cell>
      </IndexList.Row>
    )
  }

  private handleUpdateVariableName = (name: string) => {
    const {onUpdateVariable} = this.props

    onUpdateVariable({name})
  }

  private handleEditVariable = (): void => {
    this.props.onEditVariable(this.props.variable)
  }
}
