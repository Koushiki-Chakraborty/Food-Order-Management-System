package in.koushikichakraborty.foodiesapi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import in.koushikichakraborty.foodiesapi.entity.UserEntity;

import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String email);
}
