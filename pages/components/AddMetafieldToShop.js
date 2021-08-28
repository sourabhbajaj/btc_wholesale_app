
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Layout, Button, Banner, Toast, Stack, Frame } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';

// GraphQL mutation that updates the prices of products
const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

const ADD_METAFIELD = gql`
    mutation privateMetafieldUpsert($input: PrivateMetafieldInput!) {
        privateMetafieldUpsert(input: $input) {
            privateMetafield{
                key
                namespace
                value
            }
            userErrors{
                field
                message
            }            
        }        
    }
`;


class AddMetafieldToShop extends React.Component {
    static contextType = Context;
    render() {
        return ( // Uses mutation's input to update product prices
            <Mutation mutation={ADD_METAFIELD}>
                {(handleSubmit, { error, data }) => {
                    console.log({error, data});
                    
                    const [hasResults, setHasResults] = useState(false);

                    const showError = error && (
                        <Banner status="critical">{error.message}</Banner>
                    );

                    const showToast = hasResults && (
                        <Toast
                            content="Successfully updated"
                            onDismiss={() => setHasResults(false)}
                        />
                    );


                    const meta_input = {
                        namespace: "btc_discount_tag",
                        key: "last-update-datetime",
                        valueInput: {
                            value: "ABCD",
                            valueType: "STRING"
                        }
                    };


                    return (
                        <Frame>
                            {showToast}
                            <Layout.Section>
                                {showError}
                            </Layout.Section>

                            <Layout.Section>
                                <Stack distribution={"center"}>
                                    <Button
                                        primary
                                        textAlign={"center"}
                                        onClick={() => handleSubmit({ variables: { input: meta_input } })}
                                    >
                                        Add Custom Metafields
                                    </Button>
                                </Stack>
                            </Layout.Section>
                        </Frame>
                    );
                }}
            </Mutation>
        );
    }
}

export default AddMetafieldToShop;