const {GraphQLObjectType, GraphQLInt,GraphQLList, GraphQLString, GraphQLBoolean, GraphQLSchema} = require('graphql');
const axios = require('axios');

// Launch Type
const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        fairings:{type: fairType},
        flight_number:{ type: GraphQLInt},
        launchpad:{type: GraphQLString},
        launch_year:{ type: GraphQLString},
        date_utc:{ type: GraphQLString},
        success:{ type: GraphQLBoolean},
        details: {type: GraphQLString},
        rocket:{type: RocketType}
    })
});

const fairType = new GraphQLObjectType({
    name: 'Fairings',
    fields: () => ({
        reused:{ type: GraphQLBoolean},
        recovery_attempt:{ type: GraphQLBoolean},
        recovered:{ type: GraphQLBoolean}
    })
});

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id:{ type: GraphQLString},
        rocket_name:{ type: GraphQLString},
        rocket_type:{ type: GraphQLString}
    })
});



//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    
    /**
     * Two difference get requests below, first one doesn't take any
     * parameters and 2nd one take a id
    */
    
    
    fields:{
        launches:{
            type: new GraphQLList(LaunchType),
            resolve(parent, args){ //this is where we grab data: 
              return axios.get('https://api.spacexdata.com/v4/launches')
                .then(res => res.data )  
            }
        },



        getLaunch:{
            type: LaunchType,
            args:{
                id: {type: GraphQLString}
            },
            resolve(parent, args){ //this is where we grab data: 
              return axios.get(`https://api.spacexdata.com/v4/launches/${args.id}`)
                .then(res => res.data )  
            }
        }



    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})