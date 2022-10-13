![Banner image](images/n8n-and-n8nhackers.png)

# n8n-nodes-document-generator

This is an n8n community node. It helps you to create:
* One dynamic content per all input items.
* One dynamic content per input item.

If you have any questions or remarks please [contact me](mailto:contact@n8nhackers.com).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## TL;DR
Don't want to read? Import the sample workflow [Generate dynamic contents for EMAILS or HTML pages](https://app.n8n.io/workflows/1790) to test this node with random samples.
![Generate dynamic contents for EMAILS or HTML pages](images/workflow-sample.jpeg?raw=true "Generate dynamic contents for EMAILS or HTML pages")

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Compatibility

This node was developed and tested with version 0.193.5 of n8n.

## Dependencies
If you install this node, n8n will install automatically the next extra npm packages:
* handlebars: required to work with Handlebars templates

## Usage
The node can solve multiple use cases when creating content like:
* Email generation (HTML or TEXT)
* Static HTML pages
* WordPress posts
* Telegram/Slack messages

The sky is your limit!

Just follow the next samples to create your dynamic content and forget to use SET, FUNCTION, or FUNCTION ITEM nodes.

### All input items in one template

#### Cases
* You want to send a list of recent news about n8n.
* You want to send the list of the customers created in the last hour in your database.

#### Template
Supposing that you have a customer list in JSON:
```json
[
	{
		"email": "miquel@n8nhackers.com",
		"name": "Miquel"
	},
	{
		"email": "contact@n8nhackers.com",
		"name": "Contact"
	}
]
```

You need to use this template:
```
<ul id="customer_list">
  {{#each items}}
  <li>{{name}}: {{email}}</li>
  {{/each}}
</ul>
```

And you will get the next output to send by email in HTML format:
```
<ul id="customer_list">
<li>Miquel: miquel@n8nhackers.com</li>
<li>Contact: contact@n8nhackers.com</li>
</ul>
```

Property **items** is always mandatory to iterate over all items.

### One input item per template

#### Cases
* You have an invoice with header and lines and you want to send it by email.

#### Template
If you have one item/invoice with this JSON:
```json
{
	"date": "2022-01-12",
	"to": "N8n hackers",
	"address": "Granollers, Spain",
	"total": 133.10,
	"lines": [
		{
			"description": "Create a node to render items in handlebar templates",
			"quantity": 1,
			"amount": 100,
			"vat": 21,
			"total": 121
		},
		{
			"description": "Test a node to render items in handlebar templates",
			"quantity": 1,
			"amount": 10,
			"vat": 2.10,
			"total": 12.1
		}
	]
}
```

You need to use this template:
```
Date: {{date}}
To: {{to}}
Address: {{address}}
Details:
{{#each lines}}
- "{{description}}" x {{quantity}} = {{amount}}€ + {{vat}}€ = {{total}}€
{{/each}}
Total invoice: {{total}}€
```

And you will get the next output to send by email in TEXT format:
```
Date: 2022-01-12
To: N8n hackers
Address: Granollers, Spain
Details:
- "Create a node to render items in handlebar templates" x 1 = 100€ + 21€ = 121€
- "Test a node to render items in handlebar templates" x 1 = 10€ + 2.10€ = 12.10€
Total invoice: 133.10€
```

I recommend using this method if you want to send multiple invoices.

## Doubts about templates syntax
Please, check the [official page](https://handlebarsjs.com/guide/expressions.html#basic-usage) to review all the existing expressions in Handlebars.

## Another way to try it out

[N8N documentation on custom nodes](https://docs.n8n.io/nodes/creating-nodes/create-n8n-nodes-module.html)

Clone the n8n-nodes-document-generator repository and execute:
```
# Use v16.17.0 = lts/gallium
nvm use lts/gallium

# Install dependencies
npm install

# Build the code
npm run build

# "Publish" the package locally
npm link
```

Create an N8N installation and add the n8n-nodes-document-generator to it:
```
# Create an N8N installation
cd ..
mkdir n8n_install
cd n8n_install
npm init
npm install
npm install n8n

# "Install" the locally published module
npm link n8n-nodes-document-generator

# Start n8n
npx n8n
```

# Contribution

To make this node even better, please let us know, [how you use it](mailto:contact@n8nhackers.com). Commits are always welcome.

# Issues

If you have any issues, please [let us know on GitHub](https://github.com/n8nhackers/n8n-nodes-document-generator/issues).

# About

Nodes by [n8nhackers.com](https://n8nhackers.com). For productive use and consulting on this, [contact us please](mailto:contact@n8nhackers.com).

Special thanks to [N8n nodemation](https://n8n.io) workflow automation by Jan Oberhauser.

# License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
