import { Button, ButtonGroup, Card, DataTable, Page } from "@shopify/polaris";

const TagsList=({tags, openEditModal, deleteTag})=>{

    const rows=tags.map((element, index)=>(
        [
            index+1,
            element.name,
            element.discountPercentage,
            element.description,
            <ButtonGroup>
                <Button primary onClick={()=>{openEditModal(element.name, element.discountPercentage, element.description)}}>
                    Edit
                </Button>
                <Button onClick={()=>{deleteTag(element.name)}}>
                    &times;
                </Button>
            </ButtonGroup>
        ]
    ));
    return (
        <Page title="Tag definitions">
            <Card>
                <DataTable 
                    columnContentTypes={[
                        'text',
                        'text',
                        'number',
                        'text',
                        'text',
                    ]}
                    headings={[
                        "#",
                        "Tag name",
                        "Discount (%)",
                        "Description",
                        ""
                    ]}
                    rows={rows}
                />
            </Card>            
        </Page>
    );
}

export default TagsList;