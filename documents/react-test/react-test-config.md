#### Jest + Enzyme 测试方案环境配置  
--------------------------------
##### Npm环境集成Jest  
>__1.__ package.json里面添加Jest依赖  

    "devDependencies": {
      "babel-jest": "^6.0.1",
      "jest": "^21.1.0",
      "jest-cli": "^21.1.0",
      "react-addons-test-utils": "^15.0.0-rc.2",
      "react-dom": "^15.0.0-rc.2",
    }

>__2.__ package.json里面添加Jest启动脚本  

    "scripts": {
      "test": "jest",
      "test:watch": "npm test -- -- watch"
    }

>__3.__ package.json里面声明Jest配置文件([配置说明](https://facebook.github.io/jest/docs/en/configuration.html#content))  

    "jest": {
        "verbose": true,
        "bail": true,
        "moduleFileExtensions": [
            "js",
            "jsx"
        ],
        "moduleDirectories": [
            "src/conf/Api",
            "node_modules"
        ],
        "moduleNameMapper": {
            "conf/Api/(.*)": "<rootDir>/src/conf/Api/$1",
            "conf/(.*)": "<rootDir>/src/conf/$1"
        },
        "modulePaths": [
            "<rootDir>/src/conf/Api/"
        ]
    },  

##### Npm环境集成Enzyme  
>__1.__ package.json里面添加Enzyme依赖  

    "devDependencies": {
      "enzyme": "^2.9.1",
      "enzyme-to-json": "^2.0.0",
    }

##### 测试脚本的执行  
>__1.__ 命令行安装所有Npm依赖    

    npm install //或是 npm i

>__2.__ 通过配置参数执行测试([参数说明](https://facebook.github.io/jest/docs/en/cli.html#content))  

    // 直接运行测试
    npm test

    // 进行测试并生成测试覆盖报告
    // 该操作会在根目录生成一个名为 coverage 的文件夹，是测试覆盖报告的网页版，
    // 包含更多更详细的信息
    npm test -- -- coverage


    
