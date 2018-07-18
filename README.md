# Forecastico

Forecastico is an app used for stock market prediction and also it's my Bachelor's Degree Project.
It was made using [Meteor.js](https://www.meteor.com) and [Iron Meteor](https://github.com/iron-meteor/iron-cli), but also [brain.js](https://github.com/BrainJS/brain.js) for making predictions.
The dataset for each company is retrived from [IEX Trading API.](https://iextrading.com/developer/docs/)

My main purpose was to learn Meteor and access some area of Artificial Intelligence and through this project I realised those.

I found really hard to implement even this basic kind of application because there is a big lack of practical information and real life examples or even closer examples. 

# Demo

You could find and test it on https://forecastico.herokuapp.com

## How to install

Well, I would not tell you how to install this application because I started it on my old laptop which was using windows, then linux, then windows again, then linux and finally I've finished it on my new MacBook.

I would also say to have installed Node.js and Meteor, then:

    git clone https://github.com/cristianexer/forecastico.git
	
	cd forecastico
	
	meteor
This would be the basic stuff.

For any questions or something tweet me [@cristianexer](https://www.twitter.com/cristianexer).

## How it works (basically)

Ookkk so the app has a datasbase, four tables( well not really because is a MongoDB, but maybe for others has more sense ).
Accounts ,Favorites, Symbols and Profile.

I am really confident that there is no reason to explain what's about in Accounts and Profile, but anyway is about users and their experiences using the app. I couldn't done all the things I've wanted because I did not have enaugh time. But making an account and adding companies to favorite really works and also the profile.

So the "table" Symbols holds Company symbol,name and description.

Company symbols are used for making the call to the IEX API.

When the route /company/FB, for example, is accessed, is made the call to API.

The dataset is loaded in client, then the dataset is formated for chart.js and also for brain.js.

When a proccess is done, it could be seen.

Everything is really fast thanks to Meteor.

P.S If you install it on your local host make an account with email demo@gmail.com it will be Admin by default.

## Interesting files

	client/templates/company/company.js - the main beast
	
	client/lib/functions.js - the support beast

	client/stylesheets/_mixins.scss - the unicorn

## Advantages

Meteor is real time by default

Brain.js works pretty well

Everything is easy and well organised 

## Disadvantages

First loading takes too much, but that depends on hosting (heroku).

But on localhost works everything really fast.

JavaScript is not that cool as I thought.


## Conclusions

Overall I believe the app is pretty good and predictions are more closer than I expected.

## Improvements

Adpot TypeScript

Another Neural Network which could offer a value based on news and their influence, but it's also needed a Neural Network to filter fake news.

Multiple API Layers with multiple Neural Networks 

A main API for Layers handleing

The main algorithm normalize Open Price ,Close Price and Procent of Change, then use them for network, but I don't think it's enough.



