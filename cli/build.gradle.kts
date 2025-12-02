plugins {
    kotlin("jvm") version "1.9.22"
    application
}

dependencies {
    implementation(project(":core-model"))
}

kotlin {
    jvmToolchain(17)
}

application {
    mainClass.set("com.soulvan.core.cli.MainKt")
}
