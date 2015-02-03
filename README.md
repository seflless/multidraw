# Overview
Drawing app where multiple people can draw together on a larger shared screen.

  - [Live Demo](http://francoislaberge.com/secondscreen-multidraw/).
  - Based on [francoislaberge/red5pro-secondscreen-boilerplate](https://github.com/francoislaberge/red5pro-secondscreen-boilerplate)
  - [Red5Pro Secondscreen Documentation](http://red5pro.com/docs/secondscreen/html5/).
    - [Host (App/Game) Documentation](http://red5pro.com/docs/secondscreen/html5/#html-host-library)
    - [Schema (Controller) Documentation](http://red5pro.com/docs/secondscreen/html5/#html-scheme-library)

# Setup

    git clone git@github.com:francoislaberge/secondscreen-multidraw.git
    cd secondscreen-multidraw

# Running it


1. Run
```bash
./bin/run.sh
```
2. Then open up [http://localhost:8080/](http:localhost:8080/)

# Debugging it
We use [weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/) for remote debugging the controller
web page. Here are the steps to use it:

  1. Install weinre

      sudo npm install -g weinre

  2. Run weinre from a terminal tab.

      weinre --boundHost -all- --httpPort 8181

  3. Make sure that the weinre injecting code has been uncommented in ```controller/controller.html```

```html
<script>
  var weinre = document.createElement('script');
  weinre.setAttribute('src', 'http://'+ location.hostname +':8181/target/target-script-min.js#anonymous');
  document.head.appendChild(weinre);
</script>
```

  4. Make sure the app is running. Run from the multidraw folder


      ./bin/run.sh


  5. Open the app in a browser: [http:localhost:8080/](http:localhost:8080/)
  6. Connect to multidraw with the Brass Monkey app
  7. Open the weinre debugging client: [http://localhost:8181/client/#anonymous](http://localhost:8181/client/#anonymous)
  8. Select the controller.html under the **Targets** heading
  9. You should now have some basic support for inspecting the html and running javascript in a console.

Unfortunately weinre doesn't support breakpoints and code inspection. I'm looking for a better solution for doing this in the future.

# Contributing / Deploying
You'll need to have push writes to the repo.

1. Change some code. Commit changes. Push them to master.

2. We use a workflow that allows this repo to be pushed to gh-pages for easy hosting via
Github Pages. To deploy run:

```bash
./bin/deploy.sh
```

3. That moves everything onto gh-pages and push that branch and then returns to master.
To verify it worked, open up the Github page of your repo and check if your changes are live.
In original repo case it's located at:
http://francoislaberge.com/secondscreen-multidraw/
