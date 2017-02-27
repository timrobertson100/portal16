### Implementation note ###

As 27th Feb 2017 CG and BK foresee some improvements needed from the backend in order to support the usage of the tool on the front end:

- [ ] [Description of evaluation types](https://github.com/gbif/gbif-data-validator/blob/master/doc/evaluationTypes.md) should be completed before front-end has the translation files and can show them as usage aids.
- [ ] The validation issues should sample other columns because when they can be displayed together on the front-end, it's easier for visitors to understand the context/reason of the validation issue. In theory there can be unlimited columns, though in practice columns relevant to the validation type should be enough, e.g. location for occurrence interpretation, plus relevant species info.

For sampling number we don't intend to show all lines at once, as this can be too large to handle on the client side. We expect users upload the archives many times until all issues are cleaned up.

#### Front-end ideas/tasks ####

- [ ] hover info for dwc concepts
- [ ] sorting on table header
- [ ] breakdown chart for term frequency (instead of table) ?
- [ ] report like layout
- [ ] species breakdown and/or other breakdown by term
- [ ] translatable evaluation type description
- [ ] communication of how this tool is expected to be used
