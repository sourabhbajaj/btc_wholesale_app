
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Layout, Button, Banner, Toast, Stack, Frame } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';

const CREATE_METAFIELD_VISIBILITY = gql`
    mutation metafieldStorefrontVisibilityCreate($input: MetafieldStorefrontVisibilityInput!) {
        metafieldStorefrontVisibilityCreate(input: $input) {
            metafieldStorefrontVisibility{
                id
                key
                namespace
                ownerType
                updatedAt
            }
            userErrors{
                field
                message
            }            
        }        
    }
`;


class CreateVisibilityMetafield extends React.Component {
    static contextType = Context;
    render() {
        return ( // Uses mutation's input to update product prices
            <Mutation mutation={CREATE_METAFIELD_VISIBILITY}>
                {(handleSubmit, { error, data }) => {
                    console.log({error, data});
                    
                    const [hasResults, setHasResults] = useState(false);

                    const meta_visibility_input={
                        namespace: "btc_discount_tag",
                        key: "last-update-datetime",
                        ownerType: "SHOP"
                    };

                    return (
                        <Button
                            primary
                            textAlign={"center"}
                            onClick={() => handleSubmit({ variables: { input: meta_visibility_input } })}
                        >
                            Create metafield visibility
                        </Button>
                    );
                }}
            </Mutation>
        );
    }
}

export default CreateVisibilityMetafield;