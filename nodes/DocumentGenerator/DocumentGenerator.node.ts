import { handlebars, helpers } from '@jaredwray/fumanchu';
import { IExecuteFunctions } from 'n8n-core';
import {
  IBinaryKeyData,
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

/**
 * A node which allows you to generate documents by templates.
 */
export class DocumentGenerator implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'DocumentGenerator',
    name: 'documentGenerator',
    icon: 'file:DocumentGenerator.svg',
    group: ['transform'],
    version: 1,
    subtitle: '',
    //description: 'Render data using templates and save to TEXT, HTML, PDF or PNG files',
    description: 'Render data using a Handlebars template',
    defaults: {
      name: 'DocumentGenerator',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [],
    // Basic node details will go here
    properties: [
      // Resources and operations will go here
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Render Template',
            value: 'render',
            description: 'Render a text template',
            action: 'Render a text template',
          },
        ],
        default: 'render',
        noDataExpression: true,
        required: true,
      },
      {
        displayName: 'Render All Items with One Template',
        name: 'oneTemplate',
        type: 'boolean',
        default: false, // Initial state of the toggle
        description:
          'Whether to render all input items using the sample template.\nSyntax: {{#each items}}{{columnname}}{{/each}}.\nOtherwise, every item has its own template',
        displayOptions: {
          // the resources and operations to display this element with
          show: {
            operation: ['render'],
          },
        },
      },
      {
        displayName: 'Use a Template String',
        name: 'useTemplateString',
        type: 'boolean',
        default: true, // Initial state of the toggle
        description:
          'Whether to render all input items using a template String or a template URL',
        displayOptions: {
          // the resources and operations to display this element with
          show: {
            operation: ['render'],
          },
        },
      },
      {
        displayName: 'Template String',
        name: 'template',
        type: 'string',
        required: true,
        typeOptions: {
          rows: 5,
          alwaysOpenEditWindow: true,
        },
        displayOptions: {
          show: {
            useTemplateString: [true],
          },
        },
        default: '',
        placeholder: '{{handlebars template}}',
        description:
          'The template string to use for rendering. Please check the <a href="https://handlebarsjs.com/guide/expressions.html#basic-usage">official page</a> for Handlebars syntax.',
      },
      {
        displayName: 'Template URL',
        name: 'templateURL',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            useTemplateString: [false],
          },
        },
        default: '',
        placeholder: 'https://mydomain.com/emails/template.html',
        description:
          'The template URL to use for rendering. Please check the <a href="https://handlebarsjs.com/guide/expressions.html#basic-usage">official page</a> for Handlebars syntax.',
      },
      {
        displayName: 'Define a Custom Output Key',
        name: 'customOutputKey',
        type: 'boolean',
        default: false, // Initial state of the toggle
        description:
          'Whether to define a custom output key instead of the default "text" property',
        displayOptions: {
          // the resources and operations to display this element with
          show: {
            operation: ['render'],
          },
        },
      },
      {
        displayName: 'Output Key',
        name: 'outputKey',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            customOutputKey: [true],
          },
        },
        default: '',
        placeholder: 'text',
        description: 'The output property name where we save rendered text',
      }
    ],
  };
  // The execute method will go here
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData = [];

    const newItemBinary: IBinaryKeyData = {};

    const operation = this.getNodeParameter('operation', 0) as string;
    const oneTemplate = this.getNodeParameter('oneTemplate', 0) as boolean;
    const customOutputKey = this.getNodeParameter('customOutputKey', 0) as boolean;
    const useTemplateString = this.getNodeParameter('useTemplateString', 0) as boolean;
    //const binary = false; //this.getNodeParameter('binary', 0) as boolean;
    //const fileType = ''; //this.getNodeParameter('fileType', 0) as string;

    let template = '';
    if (useTemplateString) {
      template = this.getNodeParameter('template', 0) as string;
    } else {
      const templateURL = this.getNodeParameter('templateURL', 0) as string;
      template = await this.helpers.request(templateURL);
    }
    helpers({ handlebars }, {});

    const templateHelper = handlebars.compile(template);

    let key = 'text';
    if (customOutputKey) {
      key = this.getNodeParameter('outputKey', 0) as string;
    }
    
    if (oneTemplate) {
      var cleanedItems = items.map(function (item) {
        return item.json;
      });
      let newItemJson: IDataObject = {};
      newItemJson[key] = templateHelper({ items: cleanedItems });
      returnData.push({ json: newItemJson });
    } else {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (operation === 'render') {
          let newItemJson: IDataObject = {};
          // Get email input
          // Get additional fields input
          var rendered = templateHelper(item.json);
          newItemJson[key] = rendered;
          returnData.push({
            json: newItemJson,
            pairedItem: {
              item: i,
            },
            binary: Object.keys(newItemBinary).length === 0 ? undefined : newItemBinary,
          });
        }
      }
    }

    // Map data to n8n data structure
    return this.prepareOutputData(returnData);
  }
}
