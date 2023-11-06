import { Module } from '@nestjs/common';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersistenceModule } from './modules/persistence/persistence.module';
import { ConnectivityModule } from './modules/connectivity/connectivity.module';
import { FileSystemModule } from './modules/file-system/file-system.module';


@Module({
  imports: [GraphqlModule, AuthModule, PersistenceModule, ConnectivityModule, FileSystemModule],
})
export class AppModule {}
