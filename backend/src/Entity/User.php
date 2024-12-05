<?php
// api/src/Entity/User.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\ArticleQueryFilter;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use App\Controller\UpdateUserImageController;


#[Vich\Uploadable]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(
            processor: UserPasswordHasher::class,
            validationContext: ['groups' => ['Default', 'user:create']]
        ),
        new Get(),
        new Put(processor: UserPasswordHasher::class, security: "is_granted('ROLE_ADMIN') or object == user"),
        new Patch(processor: UserPasswordHasher::class, security: "is_granted('ROLE_ADMIN') or object == user"),
        new Delete(security: "is_granted('ROLE_ADMIN') or object == user"),
        new Post(
            uriTemplate: 'users/{id}/update-image',
            controller: UpdateUserImageController::class,
            inputFormats: ['multipart' => ['multipart/form-data']],
            denormalizationContext: ['groups' => ['user:write']],
            validationContext: ['groups' => ['Default', 'user:update']],
        ),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:create', 'user:update', 'user:write']],
)]
// #[ApiFilter(SearchFilter::class, properties: ['email' => 'partial', 'firstName' => 'partial', 'lastName' => 'partial'])]
#[ApiFilter(ArticleQueryFilter::class, strategy: 'partial')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private ?int $id = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Email]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;


    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    private ?string $plainPassword = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'users')]
    private Collection $events;

    #[Groups(['user:create', 'user:update', 'user:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstName = null;

    #[Groups(['user:create', 'user:update', 'user:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lastName = null;

    #[Vich\UploadableField(mapping: 'users_image', fileNameProperty: 'avatar', size: 'imageSize')]
    #[Groups(['user:create', 'user:update', 'user:read'])]
    #[Assert\Image(
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        mimeTypesMessage: "Format d'image invalide (JPEG, PNG, WEBP)."
    )]
    private ?File $imageFile = null;

    #[Groups(['user:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;
    
    #[ORM\Column(nullable: true)]
    #[Groups(['user:create', 'user:update', 'user:read'])]
    private ?int $imageSize = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $verificationToken = null;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'creator', orphanRemoval: true)]
    private Collection $event_created;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $tokenExpiry = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $Logout = null;

    #[Groups(['user:create', 'user:update'])]
    #[ORM\Column]
    private ?bool $active = null;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->event_created = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->addUser($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            $event->removeUser($this);
        }

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function __toString(){
        return $this->email; 
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the user listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageSize(?int $imageSize): void
    {
        $this->imageSize = $imageSize;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function getVerificationToken(): ?string
    {
        return $this->verificationToken;
    }

    public function setVerificationToken(?string $verificationToken): static
    {
        $this->verificationToken = $verificationToken;

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEventCreated(): Collection
    {
        return $this->event_created;
    }

    public function addEventCreated(Event $eventCreated): static
    {
        if (!$this->event_created->contains($eventCreated)) {
            $this->event_created->add($eventCreated);
            $eventCreated->setCreator($this);
        }

        return $this;
    }

    public function removeEventCreated(Event $eventCreated): static
    {
        if ($this->event_created->removeElement($eventCreated)) {
            // set the owning side to null (unless already changed)
            if ($eventCreated->getCreator() === $this) {
                $eventCreated->setCreator(null);
            }
        }

        return $this;
    }

    public function getTokenExpiry(): ?\DateTimeInterface
    {
        return $this->tokenExpiry;
    }

    public function setTokenExpiry(?\DateTimeInterface $tokenExpiry): static
    {
        $this->tokenExpiry = $tokenExpiry;

        return $this;
    }

    public function getLogout(): ?\DateTimeInterface
    {
        return $this->Logout;
    }

    public function setLogout(?\DateTimeInterface $Logout): static
    {
        $this->Logout = $Logout;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

}

