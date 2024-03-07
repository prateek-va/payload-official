import type { I18n } from '@payloadcms/translations'
import type { OptionObject, SelectField } from 'payload/types'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { Props } from '../types.d.ts'

import Label from '../../Label/index.js'
import { diffStyles } from '../styles.js'
import { DiffViewer } from './DiffViewer/index.js'
import './index.scss'

const baseClass = 'select-diff'

const getOptionsToRender = (
  value: string,
  options: SelectField['options'],
  hasMany: boolean,
): (OptionObject | string)[] | OptionObject | string => {
  if (hasMany && Array.isArray(value)) {
    return value.map(
      (val) =>
        options.find((option) => (typeof option === 'string' ? option : option.value) === val) ||
        String(val),
    )
  }
  return (
    options.find((option) => (typeof option === 'string' ? option : option.value) === value) ||
    String(value)
  )
}

const getTranslatedOptions = (
  options: (OptionObject | string)[] | OptionObject | string,
  i18n: I18n,
): string => {
  if (Array.isArray(options)) {
    return options
      .map((option) => (typeof option === 'string' ? option : getTranslation(option.label, i18n)))
      .join(', ')
  }

  return typeof options === 'string' ? options : getTranslation(options.label, i18n)
}

const Select: React.FC<Props> = ({ comparison, diffMethod, field, i18n, locale, version }) => {
  let placeholder = ''

  if (version === comparison) placeholder = `[${i18n.t('general:noValue')}]`

  const comparisonToRender =
    typeof comparison !== 'undefined'
      ? getTranslatedOptions(getOptionsToRender(comparison, field.options, field.hasMany), i18n)
      : placeholder

  const versionToRender =
    typeof version !== 'undefined'
      ? getTranslatedOptions(getOptionsToRender(version, field.options, field.hasMany), i18n)
      : placeholder

  return (
    <div className={baseClass}>
      <Label>
        {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
        {getTranslation(field.label || '', i18n)}
      </Label>
      <DiffViewer
        comparisonToRender={comparisonToRender}
        diffMethod={diffMethod}
        diffStyles={diffStyles}
        placeholder={placeholder}
        versionToRender={versionToRender}
      />
    </div>
  )
}

export default Select
